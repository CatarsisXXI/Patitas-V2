using MascotaSnacksAPI.Data;
using MascotaSnacksAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddDbContext<MascotaSnacksContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddControllers();

var frontendAppCorsPolicy = "FrontendApp";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: frontendAppCorsPolicy,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000") // URL de la app de React
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddSingleton<AdminActivityService>();
builder.Services.AddHttpClient();


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? string.Empty)),
            ValidateIssuer = false, // En producción, considera validarlo
            ValidateAudience = false // En producción, considera validarlo
        };

    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseStaticFiles();


app.UseCors(frontendAppCorsPolicy);


app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<MascotaSnacksContext>();
    await DataSeeder.SeedAsync(context);
}

app.Run();