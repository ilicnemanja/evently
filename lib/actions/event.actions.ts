"use server";

import { CreateEventParams, UpdateEventParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import Event from "../database/models/event.model";

export const createEvent = async ({ event, userId, path }: CreateEventParams) => {
    try {
        await connectToDatabase();

        const organizer = await User.findById(userId);

        if (!organizer) {
            throw new Error("Organizer not found");
        }

        const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId, path });

        return JSON.parse(JSON.stringify(newEvent));
    } catch (error) {
        handleError(error)
    }
}

export const updateEvent = async ({ userId, event, path }: UpdateEventParams) => {
    try {
        await connectToDatabase();

        // check if event exists
        const eventToUpdate = await Event.findById(event._id);

        if (!eventToUpdate) {
            throw new Error("Event not found");
        }

        // check if user is organizer
        if (eventToUpdate.organizer.toString() !== userId) {
            throw new Error("User is not organizer");
        }


        // update event
        const updatedEvent = await Event.updateOne({ _id: event._id }, { ...event, category: event.categoryId, path });

        return JSON.parse(JSON.stringify(updatedEvent));
        
    } catch (error) {
        handleError(error);
    }
}

export const getAllEvents = async () => {
    try {
        await connectToDatabase();

        const allEvents = await Event.find();

        return JSON.parse(JSON.stringify(allEvents));
    } catch (error) {
        handleError(error);
    }
}

export const getEventById = async (id: string) => {
    try {
        await connectToDatabase();

        const event = await Event.findById(id);

        return JSON.parse(JSON.stringify(event));
    } catch (error) {
        handleError(error);
    }
}