import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Input, Space, DatePicker } from "antd";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import SidebarPanel from "../../../components/ui/SidebarPanel";

export default function Articles() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const stats = [
    { label: "Posted", value: 2 },
    { label: "Archived", value: 2 },
    { label: "Pending", value: 2 },
  ];

  const tabs = ["Pending", "Posted", "Archived"];

  // Dummy data
  const data = [
    {
      key: "1",
      title: "How to Use React Hooks",
      author: "Jane Doe",
      status: "Pending",
      date: "2025-10-01",
    },
    {
      key: "2",
      title: "Understanding Async/Await",
      author: "John Smith",
      status: "Posted",
      date: "2025-09-20",
    },
    {
      key: "3",
      title: "Tailwind CSS Basics",
      author: "Alice Johnson",
      status: "Archived",
      date: "2025-09-10",
    },
  ];

  // Table columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Posted", value: "Posted" },
        { text: "Archived", value: "Archived" },
      ],
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (text) => {
        let color =
          text === "Posted" ? "green" : text === "Archived" ? "gray" : "orange";
        return <span style={{ color, fontWeight: 500 }}>{text}</span>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
  ];

  // Filter + Search + Date
  const filteredData = data.filter((item) => {
    const search = searchText.toLowerCase();

    //  Match both title and author
    const matchesSearch =
      item.title.toLowerCase().includes(search) ||
      item.author.toLowerCase().includes(search);

    const matchesDate = selectedDate
      ? dayjs(item.date).isSame(selectedDate, "day")
      : true;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="flex flex-col gap-y-2 h-full">
      <Breadcrumbs />

      <div className="h-[4rem] flex justify-start items-center">
        <h1 className="text-3xl font-semibold">Article Management</h1>
      </div>

      <div className="h-full flex gap-x-5">
        {/* Sidebar */}
        <SidebarPanel
          title="Articles"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalLabel="Total Articles"
          showDate
          stats={stats}
          buttonText="Create New Article"
          onButtonClick={() => navigate("article-builder")}
          buttonPerm="articles.create"
        />

        {/* Main Content */}
        <div className="flex flex-col w-full h-full gap-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{activeTab} Articles</h2>

            <Space>
              <Input
                placeholder="Search by title or author..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: 220 }}
              />
              <DatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholder="Select date"
                suffixIcon={<CalendarOutlined />}
                allowClear
                style={{ width: 110, height: 40 }}
              />
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 7 }}
            rowKey="key"
            bordered={false}
            showHeader
          />
        </div>
      </div>
    </div>
  );
}
