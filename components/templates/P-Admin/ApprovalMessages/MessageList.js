"use client";

import React, { useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import getApprovalMessages from "@/funcs/getApprovalMessages";
import getCookie from "@/funcs/cookies/getCookie";
import EmptyMessage from "@/components/modules/EmptyMessage";

function MessageList({ data, refreshKey = 0 }) {
  const [shownData, setShownData] = useState(data);

  const getMessagesHandler = () => {
    getApprovalMessages(getCookie("ramian-pakhsh-admin")).then((res) => {
      setShownData(res);
    });
  };

  useEffect(() => {
    if (refreshKey > 0) {
      getMessagesHandler();
    }
  }, [refreshKey]);

  return (
    <div className="my-6">
      {!shownData?.body?.length ? (
        <EmptyMessage text="هنوز پیامی برای تأیید سفارش ثبت نشده است." />
      ) : (
        <div className="admin-list">
          {shownData.body.map((message) => (
            <MessageBox
              key={message.id}
              {...message}
              getMessagesHandler={getMessagesHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageList;
