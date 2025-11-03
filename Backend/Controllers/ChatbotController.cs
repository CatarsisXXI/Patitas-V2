using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MascotaSnacksAPI.Data;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Linq;
using System;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace MascotaSnacksAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatbotController : ControllerBase
    {
        private readonly MascotaSnacksContext _context;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public ChatbotController(MascotaSnacksContext context, HttpClient httpClient, IConfiguration configuration)
        {
            _context = context;
            _httpClient = httpClient;
            _configuration = configuration;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var mascotas = await _context.Mascotas.Where(m => m.ClienteID == userId).ToListAsync();
            var userName = User.FindFirst("name")?.Value ?? "Usuario";

            // Obtener productos activos con categorías
            var productos = await _context.Productos
                .Where(p => p.Activo)
                .Include(p => p.Categoria)
                .Select(p => new
                {
                    p.Nombre,
                    p.Descripcion,
                    p.Precio,
                    Categoria = p.Categoria.Nombre
                })
                .ToListAsync();

            var categorias = await _context.Categorias.Select(c => c.Nombre).ToListAsync();

            var productosInfo = string.Join("\n", productos.Take(10).Select(p => $"- {p.Nombre} (Categoría: {p.Categoria}, Precio: ${p.Precio}): {p.Descripcion}"));
            var categoriasInfo = string.Join(", ", categorias);
            var mascotasInfo = string.Join(", ", mascotas.Select(m => $"{m.Nombre} ({m.Especie}, {m.Sexo ?? "Sexo no especificado"}, {m.Raza ?? "Raza no especificada"}, {m.Tamaño ?? "Tamaño no especificado"})"));

            var systemContent = $"Eres un asistente amigable para una tienda de snacks para mascotas llamada Patitas y Sabores. El usuario {userName} tiene las siguientes mascotas: {mascotasInfo}.\n\nProductos disponibles:\n{productosInfo}\n\nCategorías disponibles: {categoriasInfo}.\n\nInstrucciones: Responde de manera personalizada y útil. Todas tus respuestas deben basarse únicamente en los productos disponibles listados arriba. Entiende preguntas informales, con errores de tipeo, mayúsculas o minúsculas, y variaciones como 'recomiendame', 'recomendación', 'porque', 'por que', 'porqué', etc. Interpreta consultas como 'recomiendame un producto para mi mascota', 'qué me recomiendas', 'dame una recomendación' como solicitudes de recomendaciones. Si el usuario tiene más de una mascota, pregunta por cuál mascota se hace la consulta antes de dar recomendaciones. Si recomiendas algo, explica detalladamente por qué basándote en la descripción del producto, las características de la mascota específica (especie, sexo, raza, tamaño) y cómo el producto beneficia a la mascota. Responde directamente a preguntas sobre el porqué de las recomendaciones, como '¿por qué recomiendas este producto?', '¿por qué me recomiendas X?', '¿cuál es la razón?', '¿por qué?', o similares, explicando los beneficios específicos. No inventes productos ni información. Si no hay productos relevantes, sugiere alternativas de la lista o indica que no tenemos opciones específicas. Mantén respuestas concisas pero informativas.";

            var openAiApiKey = _configuration["OpenAI:ApiKey"];
            if (string.IsNullOrEmpty(openAiApiKey))
            {
                return BadRequest("OpenAI API key not configured");
            }

            var openAiRequest = new
            {
                model = "gpt-4o",
                messages = new[]
                {
                    new { role = "system", content = systemContent },
                    new { role = "user", content = request.Message }
                },
                max_tokens = 500
            };

            var json = JsonSerializer.Serialize(openAiRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", openAiApiKey);

            try
            {
                var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"OpenAI API Error: {errorContent}");
                    return BadRequest($"Error calling OpenAI API: {errorContent}");
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var openAiResponse = JsonSerializer.Deserialize<OpenAiResponse>(responseContent);
                var aiMessage = openAiResponse?.Choices?.FirstOrDefault()?.Message?.Content;
                if (string.IsNullOrEmpty(aiMessage))
                {
                    aiMessage = "Lo siento, no pude generar una respuesta. Respuesta de OpenAI: " + responseContent;
                }

                return Ok(new { message = aiMessage });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in Chatbot: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public class ChatRequest
    {
        public string Message { get; set; }
    }

    public class OpenAiResponse
    {
        [JsonPropertyName("choices")]
        public Choice[] Choices { get; set; }
    }

    public class Choice
    {
        [JsonPropertyName("message")]
        public Message Message { get; set; }
    }

    public class Message
    {
        [JsonPropertyName("content")]
        public string Content { get; set; }
    }
}
