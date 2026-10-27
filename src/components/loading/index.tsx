const Loading = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex min-h-[40vh] items-center justify-center text-gray-500" role="status">
    <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand" />
    {message}
  </div>
);

export default Loading;
