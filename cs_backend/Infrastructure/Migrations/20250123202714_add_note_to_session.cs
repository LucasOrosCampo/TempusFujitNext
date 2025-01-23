using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cs_backend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class add_note_to_session : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Sessions",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "Sessions");
        }
    }
}
