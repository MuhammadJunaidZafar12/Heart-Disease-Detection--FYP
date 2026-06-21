"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Trash2,
  MessageCircle,
  X,
  Send,
  Loader,
  Eye,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";


export default function ContactMessages() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { token } = useAuth();
  // Fetch all contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/contact/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setContacts(data.contacts || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch contacts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContact = async (contactId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/contact/${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setSelectedContact(data);
      setReplyMessage("");
    } catch (err) {
      setError("Failed to load contact details");
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      setError("Reply message cannot be empty");
      return;
    }

    setSendingReply(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/contact/${selectedContact._id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          
          body: JSON.stringify({ message: replyMessage }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reply");
      }

      // Update selected contact with new reply
      setSelectedContact(data.contact);
      setReplyMessage("");

      // Refresh contacts list
      fetchContacts();
    } catch (err) {
      setError(err.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/contact/${contactId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      setContacts(contacts.filter((c) => c._id !== contactId));
      if (selectedContact?._id === contactId) {
        setSelectedContact(null);
      }
    } catch (err) {
      setError(err.message || "Failed to delete contact");
    }
  };

  // Filter contacts
  const filteredContacts =
    filterStatus === "all"
      ? contacts
      : contacts.filter((c) => c.status === filterStatus);

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "read":
        return "bg-blue-100 text-blue-800";
      case "responded":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Mail size={20} />
              Messages ({filteredContacts.length})
            </h2>

            {/* Filter Buttons */}
            <div className="mt-3 flex gap-2 flex-wrap">
              {["all", "pending", "read", "responded"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition min-h-[36px] ${
                    filterStatus === status
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-gray-100 text-[var(--color-muted)] hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No messages found
            </div>
          ) : (
            <div className="max-h-150 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <button
                  key={contact._id}
                  onClick={() => handleSelectContact(contact._id)}
                  className={`w-full p-3 text-left border-b border-gray-50 hover:bg-[var(--color-primary)]/5 transition min-h-[44px] ${
                    selectedContact?._id === contact._id
                      ? "bg-[var(--color-primary)]/10"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {contact.subject}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(
                        contact.status,
                      )}`}
                    >
                      {contact.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Details & Reply */}
        <div className="lg:col-span-2 card overflow-hidden">
          {selectedContact ? (
            <>
              {/* Contact Header */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedContact.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedContact.email}
                    </p>
                    {selectedContact.phone && (
                      <p className="text-gray-600">{selectedContact.phone}</p>
                    )}
                    <div className="mt-3 flex gap-2 items-center">
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                          selectedContact.status,
                        )}`}
                      >
                        {selectedContact.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(selectedContact.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteContact(selectedContact._id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Original Message */}
              <div className="p-6 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {selectedContact.subject}
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>

              {/* Replies Section */}
              {selectedContact.replies &&
                selectedContact.replies.length > 0 && (
                  <div className="p-6 border-b bg-green-50">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MessageCircle size={18} className="text-green-600" />
                      Replies ({selectedContact.replies.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedContact.replies.map((reply, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded border-l-4 border-green-500"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-gray-800">
                              CardioGuard Support
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(reply.sentAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {reply.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Reply Form */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Send Reply</h3>
                <div className="space-y-3">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                    className="input resize-none"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyMessage.trim()}
                    className="btn-primary w-full"
                  >
                    {sendingReply ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 p-6">
              <div className="text-center">
                <Eye size={48} className="mx-auto mb-4 opacity-30" />
                <p>Select a message to view and reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
