import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";

import { Types } from "mongoose";
const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();

    const users = await User.find();

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    // get the data of the users
    const body = await request.json();

    // connection of the db
    await connect();

    //creating instance of new user
    const newuser = new User(body);

    // saving to the db
    await newuser.save();

    // returning back to the client
    return new NextResponse(
      JSON.stringify({ message: "user created succesfully", user: newuser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating  user" + error.message, {
      status: 500,
    });
  }
};

//// updating the user

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();

    const { userid, newusername } = body;

    await connect();

    // check if data is valid
    if (!userid || !newusername) {
      return new NextResponse("invalid userid or username", {
        status: 400,
      });
    }

    //
    if (!Types.ObjectId.isValid(userid)) {
      return new NextResponse("invalid userid", {
        status: 400,
      });
    }

    /// if user exist in db

    const updateduser = await User.findOne(
      {
        _id: new ObjectId(userid),
      },
      {
        username: newusername,
      },
      {
        new: true,
      }
    );

    // check if really got updated or not
    if (!updateduser) {
      return new NextResponse(
        JSON.stringify({ message: "user not found in the db " }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "user updated succesfully  ",
        user: updateduser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating  user" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get("userid");

    // check if data is exist
    if (!userid) {
      return new NextResponse("ID not found", {
        status: 400,
      });
    }

    //check if userid is valid
    if (!Types.ObjectId.isValid(userid)) {
      return new NextResponse("invalid userid", {
        status: 400,
      });
    }

    // connect with the db
    await connect();

    // find and delete the userid

    const deleteduser = await User.findByIdAndDelete(
      new Types.ObjectId(userid)
    );

    if (!deleteduser) {
      return new NextResponse("not found", {
        status: 400,
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "user deleted succesfully  ",
        user: deleteduser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating  user" + error.message, {
      status: 500,
    });
  }
};
