namespace PlanningPoker.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class linksChngeda : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.UserRoomLinks", "UserId", "dbo.AspNetUsers");
            AddColumn("dbo.UserRoomLinks", "UserModel_Id", c => c.String(maxLength: 128));
            CreateIndex("dbo.UserRoomLinks", "UserModel_Id");
            AddForeignKey("dbo.UserRoomLinks", "UserModel_Id", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserRoomLinks", "UserModel_Id", "dbo.AspNetUsers");
            DropIndex("dbo.UserRoomLinks", new[] { "UserModel_Id" });
            DropColumn("dbo.UserRoomLinks", "UserModel_Id");
            AddForeignKey("dbo.UserRoomLinks", "UserId", "dbo.AspNetUsers", "Id");
        }
    }
}
