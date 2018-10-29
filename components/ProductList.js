import * as React from "react";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Query, Mutation } from "react-apollo";
import {
  AppProvider,
  Page,
  Card,
  ResourceList,
  TextStyle,
  Avatar,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Button,
  TextContainer,
  Layout
} from "@shopify/polaris";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, concat } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";

export const AllProductsQuery = gql`
  {
    shop {
      products(first: 10) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  }
`;

export default function ProductList() {
  const httpLink = new HttpLink({
    uri: "https://{SHOPNAME}.myshopify.com/admin/api/graphql.json"
  });
  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext({
      headers: {
        "X-Shopify-Access-Token": "{SHOPTOKEN}",

      }
    });

    return forward(operation);
  });

  const client = new ApolloClient({
    link: concat(authMiddleware, httpLink),
    cache: new InMemoryCache(),
  });



  return (
    <ApolloProvider client={client}>
      <Query query={AllProductsQuery}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <div>
                <Card sectioned="sectioned">
                  <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText />
                  </TextContainer>
                </Card>
                <Card sectioned="sectioned">
                  <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText />
                  </TextContainer>
                </Card>
                <Card sectioned="sectioned">
                  <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText />
                  </TextContainer>
                </Card>
              </div>
            );
          if (error) return `Error! ${error.message}`;

          const products = data.shop.products.edges;
          return (
            <Card>
              <ResourceList
                resourceName={{
                  singular: "product",
                  plural: "products"
                }}
                showHeader={true}
                items={products}
                renderItem={item => {
                  const { id, title, price } = item.node;
                  const media = (
                    <Avatar customer="customer" size="medium" name={title} />
                  );
                  return (
                    <ResourceList.Item
                      id={id}
                      media={media}
                      accessibilityLabel={`View details for ${title}`}
                    >
                      <h3>
                        <TextStyle variation="strong">{title}</TextStyle>
                      </h3>
                    </ResourceList.Item>
                  );
                }}
              />
            </Card>
          );
        }}
      </Query>
    </ApolloProvider>
  );
}
