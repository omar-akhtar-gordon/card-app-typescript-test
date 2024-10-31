import { server } from "../src/server"
import Prisma from "../src/db";
import { Entry } from "@prisma/client";


describe("server test", () => {
  it("should assert 1 + 1 is 2", () => {
    expect(1 + 1).toEqual(2);
  });
});

//Check data is written correctly to database
describe("User creation", () => {
  //disconnect from database after test for efficiency reasons
  afterAll(async () => {
    await Prisma.$disconnect();
  });

  const createdAt=new Date("2024-10-31T10:00:00Z");
  const scheduledAt=new Date("2024-11-15T10:00:00Z");
//create a new card entry object
  it("should create a new card", async () => {
    const card = await Prisma.entry.create({
      data: { title: "Test", description: "working test",created_at: createdAt, scheduled_at: scheduledAt },
    });
    
    //check correct matching data
    expect(card).toHaveProperty("id");
    expect(card.title).toBe("Test");
    expect(card.description).toBe("working test");
    expect(card.created_at).toEqual(createdAt);
    expect(card.scheduled_at).toEqual(scheduledAt);
  
    // Cleanup after test
    await Prisma.entry.delete({ where: { id: card.id } });
  });
});



//check data is correctly updated to the database
describe("Card update", () => {
  let card:Entry;
  //create my data types
  const createdAt=new Date("2024-10-31T10:00:00Z");
  const scheduledAt=new Date("2024-11-15T10:00:00Z");
//dummy data to create that is deleted after
  beforeAll(async () => {
    card = await Prisma.entry.create({
      data: { title: "Test", description: "working test",created_at: createdAt, scheduled_at: scheduledAt },
    });
  });
//delete dummy data after test
  afterAll(async () => {
    await Prisma.entry.delete({ where: { id: card.id } });
    await Prisma.$disconnect();
  });
//update title
  it("should update a card's title", async () => {
    const updatedCard = await Prisma.entry.update({
      where: { id: card.id },
      data: { title: "Test2" },
    });
//check update was made
    expect(updatedCard.title).toBe("Test2");
  });
});


//card deletion test
describe("Card deletion", () => {
  let card:Entry;
  const createdAt=new Date("2024-10-31T10:00:00Z");
  const scheduledAt=new Date("2024-11-15T10:00:00Z");
//create dummy test data
  beforeAll(async () => {
    card = await Prisma.entry.create({
      data: { title: "Test", description: "working test",created_at: createdAt, scheduled_at: scheduledAt },
    });
  });
//disconnect from database
  afterAll(async () => {
    await Prisma.$disconnect();
  });
//delete dummy test data we created
  it("should delete a card", async () => {
    await Prisma.entry.delete({
      where: { id: card.id },
    });
//search for deleted data
    const deletedCard = await Prisma.entry.findUnique({
      where: { id: card.id },
    });
//check data does not exist
    expect(deletedCard).toBeNull();
  });
});


//check the get method http request
describe('Fastify Server test', () => {
  let card:Entry,card2:Entry;
  const createdAt=new Date("2024-10-31T10:00:00Z");
  const scheduledAt=new Date("2024-11-15T10:00:00Z");
//create test dummy data (2 instances)
  beforeAll(async () => {
  card=await Prisma.entry.create({
    data: 
      { title: "Test 1", description: "working test",created_at: createdAt, scheduled_at: scheduledAt},
  });
  card2=await Prisma.entry.create({
    data: 
      { title: "Test 2", description: "working test 2",created_at: createdAt, scheduled_at: scheduledAt},
  });
  });
  //delete dummy data and close server
  afterAll(async () => {
    await Prisma.entry.delete({ where: { id: card.id } });
    await Prisma.entry.delete({ where: { id: card2.id } });
    await server.close(); // ensures the server is closed after tests
  });
//if successful request has been made then the statuscode should be 200
  it('should return statuscode 200 (successful) and check all database data is returned', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/get/',
    });
//inject method and assign response
    expect(response.statusCode).toBe(200);
//jsonify response so it can be checked
    const data = response.json();
    //check the one array of objects contains both the Test1 and Test2 dummy data
    const finaltest = data.some((entry:Entry) => entry.title === 'Test 1');
    expect(finaltest).toBe(true);
    const finaltest2 = data.some((entry:Entry) => entry.title === 'Test 2');
    expect(finaltest2).toBe(true);

    
  });
});