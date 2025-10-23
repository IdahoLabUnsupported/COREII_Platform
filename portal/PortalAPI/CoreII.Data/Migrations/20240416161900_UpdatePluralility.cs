// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreII.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePluralility : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoleUser_Roles_roleid",
                table: "RoleUser");

            migrationBuilder.DropForeignKey(
                name: "FK_RoleUser_Users_userid",
                table: "RoleUser");

            migrationBuilder.RenameColumn(
                name: "userid",
                table: "RoleUser",
                newName: "usersid");

            migrationBuilder.RenameColumn(
                name: "roleid",
                table: "RoleUser",
                newName: "rolesid");

            migrationBuilder.RenameIndex(
                name: "IX_RoleUser_userid",
                table: "RoleUser",
                newName: "IX_RoleUser_usersid");

            migrationBuilder.AddColumn<string>(
                name: "userName",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RoleUser_Roles_rolesid",
                table: "RoleUser",
                column: "rolesid",
                principalTable: "Roles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoleUser_Users_usersid",
                table: "RoleUser",
                column: "usersid",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoleUser_Roles_rolesid",
                table: "RoleUser");

            migrationBuilder.DropForeignKey(
                name: "FK_RoleUser_Users_usersid",
                table: "RoleUser");

            migrationBuilder.DropColumn(
                name: "userName",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "usersid",
                table: "RoleUser",
                newName: "userid");

            migrationBuilder.RenameColumn(
                name: "rolesid",
                table: "RoleUser",
                newName: "roleid");

            migrationBuilder.RenameIndex(
                name: "IX_RoleUser_usersid",
                table: "RoleUser",
                newName: "IX_RoleUser_userid");

            migrationBuilder.AddForeignKey(
                name: "FK_RoleUser_Roles_roleid",
                table: "RoleUser",
                column: "roleid",
                principalTable: "Roles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoleUser_Users_userid",
                table: "RoleUser",
                column: "userid",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
