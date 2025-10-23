// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreII.Data.Migrations
{
    /// <inheritdoc />
    public partial class publishDate_Applications_tb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "PublishDate",
                table: "Applications",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PublishDate",
                table: "Applications");
        }
    }
}
