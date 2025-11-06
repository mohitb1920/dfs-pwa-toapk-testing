import { render, screen } from "@testing-library/react";
import App from "../App";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import { QueryClient, QueryClientProvider } from "react-query";


const store = configureStore({
  reducer: rootReducer,
});
const queryClient = new QueryClient();


describe("true is truthy and false is falsy", () => {
  test("render App", () => {
    render(
      <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
      </QueryClientProvider>
    );
  });
});
