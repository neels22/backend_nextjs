import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
export const PATCH = async (request: Request, context: { params: any }) => {
    const categoryid = context.params.category;

    try {
        const body = await request.json();
        const { title } = body;

        // Get the userid from the URL query params
        let userid;
        try {
            const parsedUrl = new URL(request.url);
            userid = parsedUrl.searchParams.get("userid");
        } catch (error) {
            return new NextResponse("Invalid URL format", { status: 400 });
        }

        // Check if `userid` exists
        if (!userid) {
            return new NextResponse("ID not found", { status: 400 });
        }

        // Validate `userid`
        if (!Types.ObjectId.isValid(userid)) {
            return new NextResponse("Invalid userid", { status: 400 });
        }

        // Validate `categoryid`
        if (!categoryid || !Types.ObjectId.isValid(categoryid)) {
            return new NextResponse("Missing or invalid category id", { status: 400 });
        }

        // Find user by `userid`
        const user = await User.findById(userid);
        if (!user) {
            return new NextResponse("User not found in the database", { status: 400 });
        }

        // Find category by `categoryid` and `userid`
        const category = await Category.findOne({
            _id: categoryid,
            user: userid,
        });
        if (!category) {
            return new NextResponse("Category not found in the database", { status: 400 });
        }

        // Update category title
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryid,
            { title },
            { new: true }
        );

        return new NextResponse(
            JSON.stringify({ message: "Category is updated", category: updatedCategory }),
            { status: 200 }
        );
    } catch (error:any) {
        return new NextResponse("Error in updating category: " + error.message, { status: 500 });
    }
};
