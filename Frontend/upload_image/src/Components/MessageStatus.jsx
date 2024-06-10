import PropTypes from "prop-types";

const MessageStatus = ({ messageStatus, toggleMessageStatus }) => {
  return (
    <div
      className="relative bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center space-x-2"
      role="alert"
    >
      <svg
        className="w-6 h-6 text-green-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
      {messageStatus && (
        <span>
          <strong>Success!</strong> Image is uploaded successfully.
        </span>
      )}
      <button
        onClick={() => toggleMessageStatus(false)}
        className="top-0 bottom-0 right-0 px-4 py-3 focus:outline-none"
      >
        <svg
          className="w-6 h-6 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

MessageStatus.propTypes = {
  toggleMessageStatus: PropTypes.func.isRequired,
  messageStatus: PropTypes.bool.isRequired,
};

export default MessageStatus;
