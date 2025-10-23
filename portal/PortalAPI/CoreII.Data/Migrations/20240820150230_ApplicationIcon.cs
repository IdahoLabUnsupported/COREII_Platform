// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreII.Data.Migrations
{
    /// <inheritdoc />
    public partial class ApplicationIcon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationIcon",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "ImagePath",
                table: "ApplicationImages",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplicationIcon",
                table: "Applications");

            migrationBuilder.AlterColumn<string>(
                name: "ImagePath",
                table: "ApplicationImages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
