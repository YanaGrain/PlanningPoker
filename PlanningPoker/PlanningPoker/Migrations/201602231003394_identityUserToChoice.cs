namespace PlanningPoker.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class identityUserToChoice : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Choices", "UserId", "dbo.AspNetUsers");
            AddColumn("dbo.Choices", "UserModel_Id", c => c.String(maxLength: 128));
            CreateIndex("dbo.Choices", "UserModel_Id");
            AddForeignKey("dbo.Choices", "UserModel_Id", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Choices", "UserModel_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Choices", new[] { "UserModel_Id" });
            DropColumn("dbo.Choices", "UserModel_Id");
            AddForeignKey("dbo.Choices", "UserId", "dbo.AspNetUsers", "Id");
        }
    }
}
