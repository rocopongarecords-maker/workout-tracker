const Bone = ({ className = '' }) => (
  <div className={`bg-white/5 rounded-lg animate-shimmer ${className}`} />
);

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Bone className="h-8 w-48 mx-auto" />
        <Bone className="h-4 w-24 mx-auto" />
      </div>

      {/* Next workout card */}
      <div className="glass-card p-6 space-y-4">
        <Bone className="h-5 w-36" />
        <div className="flex items-start gap-4">
          <Bone className="w-14 h-14 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Bone className="h-6 w-40" />
            <Bone className="h-4 w-52" />
          </div>
        </div>
        <Bone className="h-12 w-full rounded-xl" />
      </div>

      {/* Progress */}
      <div className="glass-card p-6 space-y-3">
        <Bone className="h-4 w-32" />
        <Bone className="h-2 w-full rounded-full" />
        <Bone className="h-4 w-20" />
      </div>

      {/* Nav grid */}
      <div className="grid grid-cols-3 gap-3">
        <Bone className="h-14 rounded-xl" />
        <Bone className="h-14 rounded-xl" />
        <Bone className="h-14 rounded-xl" />
        <Bone className="h-14 rounded-xl" />
        <Bone className="h-14 rounded-xl" />
        <Bone className="h-14 rounded-xl" />
      </div>

      {/* Settings */}
      <Bone className="h-10 w-full rounded-xl" />
    </div>
  );
};

export default LoadingSkeleton;
