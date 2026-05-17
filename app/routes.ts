import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/shared/layout.tsx", [
    index("routes/home.tsx"),
    route("conversation/:id", "routes/conversation.tsx"),
  ]),
] satisfies RouteConfig;
