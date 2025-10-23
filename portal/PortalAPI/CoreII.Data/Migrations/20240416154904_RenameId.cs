// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreII.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoleUser_Users_useridKey",
                table: "RoleUser");

            migrationBuilder.RenameColumn(
                name: "idKey",
                table: "Users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "useridKey",
                table: "RoleUser",
                newName: "userid");

            migrationBuilder.RenameIndex(
                name: "IX_RoleUser_useridKey",
                table: "RoleUser",
                newName: "IX_RoleUser_userid");

            migrationBuilder.AddForeignKey(
                name: "FK_RoleUser_Users_userid",
                table: "RoleUser",
                column: "userid",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoleUser_Users_userid",
                table: "RoleUser");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Users",
                newName: "idKey");

            migrationBuilder.RenameColumn(
                name: "userid",
                table: "RoleUser",
                newName: "useridKey");

            migrationBuilder.RenameIndex(
                name: "IX_RoleUser_userid",
                table: "RoleUser",
                newName: "IX_RoleUser_useridKey");

            migrationBuilder.AddForeignKey(
                name: "FK_RoleUser_Users_useridKey",
                table: "RoleUser",
                column: "useridKey",
                principalTable: "Users",
                principalColumn: "idKey",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
