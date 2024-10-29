"use client"
import React, { useEffect, useState } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { database } from "../../../firebase"; // Adjust the path as needed
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react"; // A loading spinner icon from lucide-react
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Adjust the path based on your project structure
import { Button } from "@/components/ui/button"; // Ensure you have a Button component for dialog actions

// Define the structure of a contact
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  timestamp: number; // Assuming timestamp is a number
  message: string;
  seen?: boolean; // Optional field
}

const GetContact = () => {
  const [contacts, setContacts] = useState<Contact[]>([]); // Specify the type as Contact[]
  const [loading, setLoading] = useState(true); // Loading state
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const [contactToDelete, setContactToDelete] = useState<string | null>(null); // Contact to delete

  useEffect(() => {
    // Reference to the "contacts" node in the database
    const contactsRef = ref(database, "contacts");

    // Listen for changes in the database
    onValue(
      contactsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const contactList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          })) as Contact[]; // Cast to Contact[]
          setContacts(contactList);
        } else {
          setContacts([]);
        }
        setLoading(false); // Set loading to false after data is fetched
      },
      (error) => {
        console.error("Error fetching contacts:", error);
        setLoading(false); // Stop loading in case of error
      }
    );
  }, []);

  const formatTimestamp = (timestamp: number) => {
    // Convert the timestamp to a readable format
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust options if you need a specific format
  };

  const handleDelete = (id: string) => {
    setContactToDelete(id);
    setOpenDialog(true); // Open the dialog for confirmation
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      const contactRef = ref(database, `contacts/${contactToDelete}`);
      remove(contactRef)
        .then(() => {
          console.log("Contact deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting contact:", error);
        });
      setOpenDialog(false); // Close the dialog after deletion
      setContactToDelete(null); // Reset the contact to delete
    }
  };

  const handleCheckboxChange = (id: string, seen: boolean | undefined) => {
    const contactRef = ref(database, `contacts/${id}`);
    update(contactRef, { seen: !seen }) // Toggle the seen status
      .then(() => {
        console.log("Contact seen status updated successfully");
      })
      .catch((error) => {
        console.error("Error updating seen status:", error);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-6">
            Contact Submissions
          </CardTitle>
          <CardDescription>
            All submissions from the contact form are listed below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-gray-500 dark:text-gray-400" />
              <span className="ml-2 text-lg">Loading...</span>
            </div>
          ) : contacts.length === 0 ? (
            <p>No contacts found.</p>
          ) : (
            <ul className="space-y-6">
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <Card className="p-4 bg-gray-100 dark:bg-zinc-800/30">
                    <CardHeader>
                      <CardTitle>
                        {contact.firstName} {contact.lastName}
                      </CardTitle>
                      <CardDescription>
                        <Link href={`mailto:${contact.email}`}>
                          {contact.email}
                        </Link>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <strong>Country:</strong> {contact.country}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        <Link href={`tel:${contact.phone}`}>
                          {contact.phone}
                        </Link>
                      </p>
                      <p>
                        <strong>Submitted on:</strong>{" "}
                        {formatTimestamp(contact.timestamp)}
                      </p>
                      <Separator className="my-4" />
                      <p>
                        <strong>Message:</strong> {contact.message}
                      </p>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={contact.seen || false} // Ensure seen is defined
                          onChange={() =>
                            handleCheckboxChange(contact.id, contact.seen)
                          }
                          className="mr-2"
                        />
                        <label>Seen</label>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(contact.id)}
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this contact? This action cannot
            be undone.
          </DialogDescription>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="ml-2"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetContact;