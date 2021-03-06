import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import FeedOverview from "./FeedOverview";
import React from "react";
import RssParser from "../my-rss-parser/RssParser";
import { of } from "rxjs";
import FeedItem from "../feed-item/FeedItem";
import { mount } from "enzyme";

jest.mock("../my-rss-parser/RssParser");

describe("FeedOverview", function() {
  let container = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;

    jest.resetAllMocks();
  });

  it("should render feed overview", async () => {
    jest.spyOn(RssParser.prototype, "parse").mockImplementation(() =>
      of({
        title: "Title",
        sourceUrl: "source-url",
        items: []
      })
    );
    await act(async () => {
      render(<FeedOverview sourceUrl="test-url" />, container);
    });
    expect(RssParser).toHaveBeenCalled();

    expect(container.querySelector("h3").textContent).toEqual("Title");
  });

  it("should have exactly the same feed item children as its state", () => {
    jest.spyOn(RssParser.prototype, "parse").mockImplementation(() =>
      of({
        title: "Title",
        sourceUrl: "source-url",
        items: [
          {
            title: "Item 1",
            id: 1
          }
        ]
      })
    );
    const wrapper = mount(<FeedOverview sourceUrl="test-url" />);

    expect(wrapper.find(FeedItem)).toHaveLength(1);
  });
});
