namespace PlanningPoker.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class linksAndStories : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Choices", "Card_Id", "dbo.Cards");
            DropForeignKey("dbo.Choices", "Room_Id", "dbo.Rooms");
            DropForeignKey("dbo.Choices", "User_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Choices", new[] { "Card_Id" });
            DropIndex("dbo.Choices", new[] { "Room_Id" });
            DropIndex("dbo.Choices", new[] { "User_Id" });
            CreateTable(
                "dbo.UserRoomLinks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(maxLength: 128),
                        RoomId = c.Int(nullable: false),
                        IsAdmin = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Rooms", t => t.RoomId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.RoomId);
            
            CreateTable(
                "dbo.Stories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        IsEstimated = c.Boolean(nullable: false),
                        Points = c.Int(nullable: false),
                        RoomId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Rooms", t => t.RoomId, cascadeDelete: true)
                .Index(t => t.RoomId);
            
            DropTable("dbo.Choices");
        }
        
        public override void Down()
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
                .PrimaryKey(t => t.Id);
            
            DropForeignKey("dbo.UserRoomLinks", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.UserRoomLinks", "RoomId", "dbo.Rooms");
            DropForeignKey("dbo.Stories", "RoomId", "dbo.Rooms");
            DropIndex("dbo.Stories", new[] { "RoomId" });
            DropIndex("dbo.UserRoomLinks", new[] { "RoomId" });
            DropIndex("dbo.UserRoomLinks", new[] { "UserId" });
            DropTable("dbo.Stories");
            DropTable("dbo.UserRoomLinks");
            CreateIndex("dbo.Choices", "User_Id");
            CreateIndex("dbo.Choices", "Room_Id");
            CreateIndex("dbo.Choices", "Card_Id");
            AddForeignKey("dbo.Choices", "User_Id", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.Choices", "Room_Id", "dbo.Rooms", "Id");
            AddForeignKey("dbo.Choices", "Card_Id", "dbo.Cards", "Id");
        }
    }
}
