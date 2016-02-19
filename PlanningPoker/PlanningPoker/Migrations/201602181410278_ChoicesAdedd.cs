namespace PlanningPoker.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChoicesAdedd : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Choices",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CardId = c.Int(nullable: false),
                        UserId = c.String(maxLength: 128),
                        StoryId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Cards", t => t.CardId, cascadeDelete: true)
                .ForeignKey("dbo.Stories", t => t.StoryId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .Index(t => t.CardId)
                .Index(t => t.UserId)
                .Index(t => t.StoryId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Choices", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Choices", "StoryId", "dbo.Stories");
            DropForeignKey("dbo.Choices", "CardId", "dbo.Cards");
            DropIndex("dbo.Choices", new[] { "StoryId" });
            DropIndex("dbo.Choices", new[] { "UserId" });
            DropIndex("dbo.Choices", new[] { "CardId" });
            DropTable("dbo.Choices");
        }
    }
}
