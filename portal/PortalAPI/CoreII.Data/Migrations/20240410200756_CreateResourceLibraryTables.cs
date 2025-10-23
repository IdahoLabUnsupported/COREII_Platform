// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreIIApi.Migrations
{
    /// <inheritdoc />
    public partial class CreateResourceLibraryTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ResourceLibraryCategories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(name: "Category_Id", type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(name: "Category_Name", type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResourceLibraryCategories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "ResourceLibraries",
                columns: table => new
                {
                    FileId = table.Column<int>(name: "File_Id", type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(name: "File_Name", type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Comments = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShortName = table.Column<string>(name: "Short_Name", type: "nvarchar(max)", nullable: false),
                    PublishDate = table.Column<DateTime>(name: "Publish_Date", type: "datetime2", nullable: false),
                    DocVersion = table.Column<string>(name: "Doc_Version", type: "nvarchar(max)", nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SourceType = table.Column<string>(name: "Source_Type", type: "nvarchar(max)", nullable: false),
                    CategoryId = table.Column<int>(name: "Category_Id", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResourceLibraries", x => x.FileId);
                    table.ForeignKey(
                        name: "FK_ResourceLibraries_ResourceLibraryCategories_Category_Id",
                        column: x => x.CategoryId,
                        principalTable: "ResourceLibraryCategories",
                        principalColumn: "Category_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ResourceLibraries_Category_Id",
                table: "ResourceLibraries",
                column: "Category_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ResourceLibraries");

            migrationBuilder.DropTable(
                name: "ResourceLibraryCategories");
        }
    }
}
