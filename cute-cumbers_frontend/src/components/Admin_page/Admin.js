import "bootstrap/dist/css/bootstrap.min.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AdminMenu from "./AdminMenu";
import AdminDraft from "./AdminDraft";
import AdminCalendar from "./AdminCalender/AdminCalender";
import AdminViewDeliverySlots from "./AdminCalender/AdminViewDeliverySlots";
import { useState } from "react";

/*
 * Admin Dashboard with 4 key functions: (easier to go through this way as well)
 * 1. Manage Menu (Edit/Publish/Delete)
 * 2. Add New Items
 * 3. Configure Delivery Slots and Times open
 * 4. View Weekly Schedule
 */

function Admin() {
  const [activeTab, setActiveTab] = useState("adminmenu");

  return (
    <div className="w-75 mx-auto mt-5">
      <h3 className="text-dark bg-light mb-0 pt-3 text-center">Admin page</h3>
      <Tabs
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        id="admin-tabs"
        className="bg-light p-2"
        fill
      >
        {/* activeTab - When item is saved then the admin page should be refreshed to see the menu */}
        <Tab eventKey="adminmenu" title="Menu Items">
          <AdminMenu activeTab={activeTab} />
        </Tab>
        {/* You can add new items */}
        <Tab eventKey="additem" title="Add Item">
          <AdminDraft />
        </Tab>
        {/* Input what times you are open and closed and also how much delivery slots there are */}
        <Tab eventKey="schedule" title="Weekly Time Slots">
          <AdminCalendar />
        </Tab>
        {/* simplified slots viewer */}
        <Tab eventKey="viewslots" title="View Delivery Slots">
          <AdminViewDeliverySlots refresh={activeTab === "viewslots"} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Admin;