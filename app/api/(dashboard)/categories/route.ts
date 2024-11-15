import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";

import { Types } from "mongoose";
const ObjectId = require("mongoose").Types.ObjectId;


export const GET =async(request:Request)=>{
    try {
        //get the userid from url
        const { searchParams } = new URL(request.url);
        const userid = searchParams.get("userid");

        // check if exists
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


          await connect()


          const user = await User.findById(userid)

          if (!user) {
            return new NextResponse("User not found in the db", {
                status: 400,
              });
          }



        const  categories = await Category.find(
            {
                user:new Types.ObjectId(userid),
            }
        )


        return new NextResponse(JSON.stringify(categories),{
            status:200
        })




        
    } catch (error:any) {
        return new NextResponse("error fetching categories"+error.message,{
            status:500
        })
    }
}



export const POST = async (request:Request) => {
    try {

         //get the userid from url
        const { searchParams } = new URL(request.url);
        const userid = searchParams.get("userid");


        const {title} = await request.json()

        // check if exists
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


          await connect()

    
          const user = await User.findById(userid)

          if (!user) {
            return new NextResponse("User not found in the db", {
                status: 400,
              });
          }

          const newcategory = new Category(
            {
                title,
                user : new Types.ObjectId(userid),
            }
          )


          await newcategory.save()

          return new NextResponse(
            
                JSON.stringify({message:"category is created", category:newcategory}),
                {status:200}
            
          )





        
    } catch (error:any) {
        return new NextResponse("error in creating category"+error.message,{
            status:500
        })
    }
}