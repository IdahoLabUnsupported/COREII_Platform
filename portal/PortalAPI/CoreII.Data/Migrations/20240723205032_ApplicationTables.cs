// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreII.Data.Migrations
{
    /// <inheritdoc />
    public partial class ApplicationTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Applications",
                columns: table => new
                {
                    ApplicationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TextWorks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TextData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TextHelps = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TextSummary = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tlr = table.Column<int>(type: "int", nullable: false),
                    ApplicationUrl = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Applications", x => x.ApplicationId);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationImages",
                columns: table => new
                {
                    ApplicationImageId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImagePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ApplicationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationImages", x => x.ApplicationImageId);
                    table.ForeignKey(
                        name: "FK_ApplicationImages_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "ApplicationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationImages_ApplicationId",
                table: "ApplicationImages",
                column: "ApplicationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationImages");

            migrationBuilder.DropTable(
                name: "Applications");
        }
    }
}
