"use client";

import React, { useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import getApprovalMessages from "@/funcs/getApprovalMessages";
import getCookie from "@/funcs/cookies/getCookie";
import EmptyMessage from "@/components/modules/EmptyMessage";

function MessageList({ data, stage = "approve", refreshKey = 0, emptyText }) {
  const [shownData, setShownData] = useState(data);

  const getMessagesHandler = () => {
    getApprovalMessages(getCookie("ramian-pakhsh-admin"), stage).then((res) => {
      setShownData(res);
    });
  };

  useEffect(() => {
    setShownData(data);
  }, [data, stage]);

  useEffect(() => {
    if (refreshKey > 0) {
      getMessagesHandler();
    }
  }, [refreshKey, stage]);

  return (
    <div className="my-6">
      {!shownData?.body?.length ? (
        <EmptyMessage text={emptyText || "هنوز پیامی ثبت نشده است."} />
      ) : (
        <div className="admin-list">
          {shownData.body.map((message) => (
            <MessageBox
              key={message.id}
              {...message}
              stage={stage}
              getMessagesHandler={getMessagesHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageList;
