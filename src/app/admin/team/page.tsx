import { Users, Plus, Mail, Shield } from "lucide-react";

const teamMembers = [
  {
    id: "1",
    name: "David Clarke",
    email: "david@example.com",
    role: "Admin",
    initials: "DC",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "Editor",
    initials: "JD",
  },
  {
    id: "3",
    name: "John Smith",
    email: "john@example.com",
    role: "Editor",
    initials: "JS",
  },
];

export default function TeamPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Team</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your team members and their permissions
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">
                  {member.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {member.email}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Shield className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">
                    {member.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
