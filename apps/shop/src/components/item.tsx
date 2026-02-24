"use client";

import { syncCartWithBackend, updateCart } from "@/services/cart";
import { clx, Table, Text } from "@medusajs/ui";
import Cookies from "js-cookie";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "react-use-cart";

import CartItemSelect from "./cart-item-select";
import DeleteButton from "./delete-button";
import ErrorMessage from "./error-message";
import Spinner from "./icons/spinner";
import LineItemOptions from "./line-item-options";
import LineItemPrice from "./line-item-price";
import LineItemUnitPrice from "./line-item-unit-price";
import Thumbnail from "./thumbnail";

type ItemProps = {
    currencyCode: string;
    item: any;
    type?: "full" | "preview";
};

const getSessionId = () => {
    return Cookies.get("cart-session") || "";
};

const Item = ({ type = "full", currencyCode, item }: ItemProps) => {
    const [updating, setUpdating] = useState(false);
    const { updateItemQuantity } = useCart();
    const [error, setError] = useState<null | string>(null);

    const changeQuantity = (quantity: number) => {
        setError(null);
        setUpdating(true);

        setTimeout(async () => {
            updateItemQuantity(item.id, quantity);

            try {
                const sessionId = getSessionId();
                await syncCartWithBackend(
                    {
                        id: item.id,
                        action: "update",
                        product: item.productId,
                        quantity,
                        variantId: item.id,
                    },
                    sessionId
                );
            } catch (error: any) {
                setError(error.message);
            }
            setUpdating(false);
        }, 200);
    };

    const maxQuantity = item?.manage_inventory ? 10 : 10;

    return (
        <Table.Row className="w-full" data-testid="product-row">
            <Table.Cell className="!pl-0 p-4 w-24">
                <Link
                    className={clx("flex", {
                        "small:w-24 w-12": type === "full",
                        "w-16": type === "preview",
                    })}
                    href={`/products/${item.handle}`}
                >
                    <Thumbnail
                        size="square"
                        thumbnail={item.gallery?.[0]?.url}
                    />
                </Link>
            </Table.Cell>

            <Table.Cell className="text-left">
                <Text
                    className="txt-medium-plus text-ui-fg-base"
                    data-testid="product-title"
                >
                    {item.productName}
                </Text>
                <LineItemOptions data-testid="product-variant" variant={item} />
            </Table.Cell>

            {type === "full" && (
                <Table.Cell>
                    <div className="flex gap-2 items-center w-28">
                        <DeleteButton
                            data-testid="product-delete-button"
                            id={item.id}
                            productId={item.productId}
                        />
                        <CartItemSelect
                            className="w-14 h-10 p-4"
                            data-testid="product-select-button"
                            onChange={(value: any) =>
                                changeQuantity(
                                    Number.parseInt(value.target.value)
                                )
                            }
                            value={item.quantity}
                        >
                            {/* TODO: Update this with the v2 way of managing inventory */}
                            {Array.from(
                                {
                                    length: Math.min(maxQuantity, 10),
                                },
                                (_, i) => (
                                    <option key={i} value={i + 1}>
                                        {i + 1}
                                    </option>
                                )
                            )}

                            <option key={1} value={1}>
                                1
                            </option>
                        </CartItemSelect>
                        {updating && <Spinner />}
                    </div>
                    <ErrorMessage
                        data-testid="product-error-message"
                        error={error}
                    />
                </Table.Cell>
            )}

            {type === "full" && (
                <Table.Cell className="hidden small:table-cell">
                    <LineItemUnitPrice
                        currencyCode={currencyCode}
                        item={item}
                        style="tight"
                    />
                </Table.Cell>
            )}

            <Table.Cell className="!pr-0">
                <span
                    className={clx("!pr-0", {
                        "flex flex-col items-end h-full justify-center":
                            type === "preview",
                    })}
                >
                    <LineItemPrice
                        cartTotal={item.price * item.quantity}
                        currencyCode={currencyCode}
                        originalPrice={item.originalPrice}
                        style="tight"
                    />
                </span>
            </Table.Cell>
        </Table.Row>
    );
};

export default Item;
