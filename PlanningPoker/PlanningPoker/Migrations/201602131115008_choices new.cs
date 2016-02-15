namespace PlanningPoker.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class choicesnew : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Choices",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Card_Id = c.Int(),
                        Room_Id = c.Int(),
                        User_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Cards", t => t.Card_Id)
                .ForeignKey("dbo.Rooms", t => t.Room_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id)
                .Index(t => t.Card_Id)
                .Index(t => t.Room_Id)
                .Index(t => t.User_Id);
            
            AddColumn("dbo.AspNetUsers", "Password", c => c.String(maxLength: 100));
            AddColumn("dbo.AspNetUsers", "ConfirmPassword", c => c.String());
            AddColumn("dbo.AspNetUsers", "Discriminator", c => c.String(nullable: false, maxLength: 128));
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Choices", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Choices", "Room_Id", "dbo.Rooms");
            DropForeignKey("dbo.Choices", "Card_Id", "dbo.Cards");
            DropIndex("dbo.Choices", new[] { "User_Id" });
            DropIndex("dbo.Choices", new[] { "Room_Id" });
            DropIndex("dbo.Choices", new[] { "Card_Id" });
            DropColumn("dbo.AspNetUsers", "Discriminator");
            DropColumn("dbo.AspNetUsers", "ConfirmPassword");
            DropColumn("dbo.AspNetUsers", "Password");
            DropTable("dbo.Choices");
        }
    }
}
