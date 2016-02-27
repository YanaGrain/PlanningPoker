namespace PlanningPoker.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class closedStories : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Stories", "IsClosed", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Stories", "IsClosed");
        }
    }
}
