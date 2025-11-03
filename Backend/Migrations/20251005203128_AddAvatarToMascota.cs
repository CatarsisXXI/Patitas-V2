using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MascotaSnacksAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddAvatarToMascota : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Avatar",
                table: "Mascotas",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Avatar",
                table: "Mascotas");
        }
    }
}
