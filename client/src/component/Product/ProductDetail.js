import React, { useEffect, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProductDetail, newReview } from "../../actions/productAction";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { Rating } from "@material-ui/lab";
import MetaData from "../layout/MetaData";
import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { clearError } from '../../actions/clearErrorAction';
import { addItemsToCard  } from '../../actions/cartActions';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, } from "@material-ui/core";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

function ProductDetail({match}) {

    const dispatch = useDispatch();
    const alert = useAlert();
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const { product, loading, error } = useSelector(state => state.productDetail);
    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
    );
    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };


    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearError());
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearError());
        }
    
        if (success) {
        alert.success("Review Submitted Successfully");
        dispatch({ type: NEW_REVIEW_RESET });
        }

        dispatch(getProductDetail(match.params.id));
    }, [dispatch, match, alert, error, reviewError, success]);


    const increaseQuantity = () => {
        if (product.stock <= quantity) return;
    
        const qty = quantity + 1;
        setQuantity(qty);
    };

    const addItemsToCardHandler = () => {
        dispatch(addItemsToCard(match.params.id, quantity));
        alert.success("Items added Succesfully");
    }

    const decreaseQuantity = () => {
        if (1 >= quantity) return;
    
        const qty = quantity - 1;
        setQuantity(qty);
    };

    const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
    };

    const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", match.params.id);

    dispatch(newReview(myForm));

    setOpen(false);
    };

    return (
        <Fragment>
            {loading ? <Loader />: (
                <Fragment>
            <MetaData title={`${product.name} -- ECOMMERCE`} />
                <div className="ProductDetails">
                    <div>
                        <Carousel>
                            {product.images &&
                            product.images.map((item, i) => (
                                <img
                                className="CarouselImage"
                                key={i}
                                src={item.url}
                                alt={`${i} Slide`}
                                />
                            ))}
                        </Carousel>
                    </div>

                    <div>
                        <div className="detailsBlock-1">
                            <h2>{product.name}</h2>
                            <p>Product # {product._id}</p>
                        </div>
                        <div className="detailsBlock-2">
                            <Rating {...options} />
                            <span className="detailsBlock-2-span">
                            {" "}
                            ({product.numOfReviews} Reviews)
                            </span>
                        </div>
                

                        <div className="detailsBlock-3">
                            <h1>{`₹${product.price}`}</h1>
                            <div className="detailsBlock-3-1">
                                <div className="detailsBlock-3-1-1">
                                    <button onClick={decreaseQuantity}>-</button>
                                    <input readOnly type="number" value={quantity} />
                                    <button onClick={increaseQuantity}>+</button>
                                </div>
                                <button disabled={product.Stock < 1 || product.stock < 1} onClick={addItemsToCardHandler} >Add to Cart</button>
                            </div>

                            <p> Status:
                                <b className={product.Stock < 1 && product.stock < 1 ? "redColor" : "greenColor"}>
                                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                </b>
                            </p>
                        </div>
                
                        <div className="detailsBlock-4">
                            Description : <p>{product.discription}</p>
                        </div>

                        <button onClick={submitReviewToggle} className="submitReview">
                        Submit Review
                        </button>
                    </div>
                </div>

                <h3 className="reviewsHeading">REVIEWS</h3>
                
                <Dialog
                    aria-labelledby="simple-dialog-title"
                    open={open}
                    onClose={submitReviewToggle}
                >
                    <DialogTitle>Submit Review</DialogTitle>
                    <DialogContent className="submitDialog">
                    <Rating
                        onChange={(e) => setRating(e.target.value)}
                        value={rating}
                        size="large"
                    />

                    <textarea
                        className="submitDialogTextArea"
                        cols="30"
                        rows="5"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={submitReviewToggle} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={reviewSubmitHandler} color="primary">
                        Submit
                    </Button>
                    </DialogActions>
            </Dialog>

                {product.reviews && product.reviews[0] ? (
                    <div className="reviews">
                    {product.reviews &&
                        product.reviews.map((review) => (
                            <ReviewCard key={review._id} review={review} />
                        ))}
                    </div>
                ) : (
                    <p className="noReviews">No Reviews Yet</p>
                )}
        </Fragment>
            )}
        </Fragment>
    );
}

export default ProductDetail;