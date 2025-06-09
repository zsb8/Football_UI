import React from "react";

export interface ChatMessageType {
  id: string;
  user: string;
  robot: string;
  documentation: Array<string>;
}

export interface QuestionResType {
  Question: string;
  Response: string;
}
