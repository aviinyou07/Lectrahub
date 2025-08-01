
import { useEffect, useState } from "react";
import { CONTACT } from "@/utils/apis";
import { showError, showSuccess } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import format from "date-fns/format";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";


interface Message {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  university?: string;
  subject?: string;
  message: string;
  status: "pending" | "replied" | "archived";
  adminReply?: string;
  repliedBy?: string;
  createdAt: string;
  repliedAt?: string;
}

const TABS = ["all", "pending", "replied"];

export default function ContactMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [replyModal, setReplyModal] = useState<{ open: boolean; msg: Message | null }>({ open: false, msg: null });
  const [replyText, setReplyText] = useState("");
  const adminName = "AdminUser";
  const token = localStorage.getItem("admin_token");
  const messagesPerPage = 5;
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [replying, setReplying] = useState(false);


  const confirmDelete = (message: Message) => {
    setMessageToDelete(message);
    setDeleteModalOpen(true);
  };


  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(CONTACT.GET_ALL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch messages.");
      }

      const data = await res.json();
      setMessages(data);
    } catch {
      showError("Could not load messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyModal.msg || !replyText.trim()) return showError("Reply is empty.");
    setReplying(true);
    try {
      const res = await fetch(CONTACT.REPLY(replyModal.msg._id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ adminReply: replyText.trim(), repliedBy: adminName })
      });

      if (!res.ok) throw new Error();

      showSuccess("Reply sent.");
      setReplyModal({ open: false, msg: null });
      setReplyText("");
      fetchMessages();
    } catch {
      showError("Failed to send reply.");
    } finally {
      setReplying(false);
    }
  };


  const handleDelete = async () => {
    if (!messageToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(CONTACT.DELETE(messageToDelete._id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();
      showSuccess("Message deleted.");
      setMessages((prev) => prev.filter((msg) => msg._id !== messageToDelete._id));
    } catch {
      showError("Failed to delete message.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setMessageToDelete(null);
    }
  };


  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages =
    activeTab === "all" ? messages : messages.filter((m) => m.status === activeTab);

  const paginatedMessages = filteredMessages.slice(
    (page - 1) * messagesPerPage,
    page * messagesPerPage
  );

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contact Messages</h1>

      <div className="flex space-x-4">
        {TABS.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : paginatedMessages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        paginatedMessages.map((msg) => (
          <Card key={msg._id} className="shadow-sm border">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>
                  {msg.firstName} {msg.lastName}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {msg.email} {msg.university ? `| ${msg.university}` : ""}
                </p>
                <p className="text-xs text-gray-400">
                  Submitted: {format(new Date(msg.createdAt), "PPP p")}
                </p>
                {msg.repliedAt && (
                  <p className="text-xs text-gray-400">
                    Replied: {format(new Date(msg.repliedAt), "PPP p")}
                  </p>
                )}
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded self-start mt-1 ${msg.status === "replied"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {msg.status}
              </span>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">Subject:</p>
                <p>{msg.subject || "-"}</p>
              </div>

              <div>
                <p className="font-medium">Message:</p>
                <p className="whitespace-pre-wrap text-sm text-gray-700">{msg.message}</p>
              </div>

              {msg.status === "pending" ? (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setReplyModal({ open: true, msg })}
                  >
                    Reply
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-400" onClick={() => confirmDelete(msg)}>
                    Delete
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-green-700 font-medium">
                    Replied by: {msg.repliedBy}
                  </p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {msg.adminReply}
                  </p>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="mt-2"
                    onClick={() => handleDelete(msg._id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <span className="text-sm self-center">Page {page} of {totalPages}</span>
          <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        message={`Are you sure you want to delete message from ${messageToDelete?.email}?`}
        loading={deleting}
      />


      {/* Reply Modal */}
      <Dialog open={replyModal.open} onOpenChange={(open) => !open && setReplyModal({ open: false, msg: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {replyModal.msg?.email}</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleReplySubmit} disabled={replying}>
              {replying ? "Sending..." : "Send Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
