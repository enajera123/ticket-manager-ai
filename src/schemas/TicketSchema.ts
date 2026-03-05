import type { Ticket } from "@/model/Ticket";
import * as Yup from "yup";
export const TicketSchema = Yup.object().shape({
    projectId: Yup.string().required("Project is required"),
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    type: Yup.mixed<Ticket["type"]>().oneOf(["BUG", "FEATURE", "IMPROVEMENT", "TASK", "SUPPORT"]).required("Type is required"),
    priority: Yup.mixed<Ticket["priority"]>().oneOf(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).required("Priority is required"),
    status: Yup.mixed<Ticket["status"]>().oneOf(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).required("Status is required"),
    deadline: Yup.string().required("Deadline is required"),
    estimatedHours: Yup.number().min(0, "Estimated hours must be a positive number").required("Estimated hours are required"),
    tags: Yup.array().of(Yup.string()).required("At least one tag is required"),
    assignedTo: Yup.string().optional(),
    createdAt: Yup.string().required("Created at is required"),
    updatedAt: Yup.string().required("Updated at is required"),
})

export const ticketInitialValues = (ticket: Ticket | null) => {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    return {
        id: ticket?.id,
        projectId: ticket?.projectId || "",
        title: ticket?.title || "",
        description: ticket?.description || "",
        type: ticket?.type || "FEATURE",
        priority: ticket?.priority || "LOW",
        status: ticket?.status || "OPEN",
        deadline: ticket?.deadline || oneWeekFromNow.toISOString().split("T")[0],
        estimatedHours: ticket?.estimatedHours || 4,
        tags: ticket?.tags || [],
        assignedTo: ticket?.assignedTo,
        originalPrompt: ticket?.originalPrompt || "",
        createdAt: ticket?.createdAt || new Date().toISOString(),
        updatedAt: ticket?.updatedAt || new Date().toISOString(),
    } as Partial<Ticket>
};