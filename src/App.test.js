import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (String(url).includes("/api/products")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: "success", data: { products: [] } }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: "success", data: {} }),
    });
  });
});

test("renders shop brand", async () => {
  render(<App />);
  expect(await screen.findAllByText(/SHIPKART/i)).not.toHaveLength(0);
});
