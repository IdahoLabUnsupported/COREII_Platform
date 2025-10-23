// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreII.Data.Migrations
{
    /// <inheritdoc />
    public partial class ApplicationNameUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationName",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplicationName",
                table: "Applications");
        }
    }
}
