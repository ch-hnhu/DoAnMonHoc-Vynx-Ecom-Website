import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Component hiển thị và chọn số sao đánh giá
 * @param {number} rating - Số sao hiện tại (1-5)
 * @param {function} onRatingChange - Callback khi user chọn sao (chỉ dùng khi editable=true)
 * @param {boolean} editable - Cho phép chọn sao hay chỉ hiển thị
 * @param {string} size - Kích thước sao: 'sm', 'md', 'lg'
 */
export default function StarRating({
  rating = 0,
  onRatingChange = null,
  editable = false,
  size = "md",
}) {
  const [hoverRating, setHoverRating] = useState(0);

  // Xác định kích thước icon
  const sizeClass = {
    sm: "fs-6",
    md: "fs-5",
    lg: "fs-4",
  }[size] || "fs-5";

  /**
   * Xử lý khi user click vào sao
   */
  const handleClick = (selectedRating) => {
    if (editable && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  /**
   * Xử lý khi user hover vào sao
   */
  const handleMouseEnter = (selectedRating) => {
    if (editable) {
      setHoverRating(selectedRating);
    }
  };

  /**
   * Xử lý khi user rời khỏi vùng sao
   */
  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  /**
   * Xác định sao nào được tô màu
   */
  const displayRating = hoverRating || rating;

  return (
    <div className="d-inline-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`${
            star <= displayRating ? "fas fa-star text-warning" : "far fa-star text-muted"
          } ${sizeClass} ${editable ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: editable ? "pointer" : "default",
            transition: "color 0.2s ease",
          }}
          title={editable ? `${star} sao` : ""}
        ></i>
      ))}
      {/* Hiển thị số sao bên cạnh */}
      {rating > 0 && (
        <span className="ms-1 text-muted small">
          ({rating}/5)
        </span>
      )}
    </div>
  );
}

StarRating.propTypes = {
  rating: PropTypes.number,
  onRatingChange: PropTypes.func,
  editable: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

