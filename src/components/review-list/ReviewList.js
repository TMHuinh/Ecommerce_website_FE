import React, { useEffect, useState } from "react";
import Review from "../review/Review";
import "./ReviewList.css";

const ReviewList = ({ productID }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productID) return;

    const fetchReviews = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8888/api/v1/review-service/review/list-review-of-product/${productID}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setReviews(data.result || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productID]);

  if (loading) {
    return <p className="review-message">Đang tải đánh giá...</p>;
  }

  if (reviews.length === 0) {
    return <p className="review-message">Chưa có đánh giá nào.</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((item) => (
        <div key={item.id || item.reviewID} className="review-item">
          <Review review={item} />
        </div>
      ))}
    </div>
  );
};

export default ReviewList;