import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { APIProvider } from "./provider";

describe("APIProvider", () => {
  test("renders children", () => {
    render(
      <APIProvider>
        <div>API foundation ready</div>
      </APIProvider>,
    );

    expect(screen.getByText("API foundation ready")).toBeDefined();
  });
});
