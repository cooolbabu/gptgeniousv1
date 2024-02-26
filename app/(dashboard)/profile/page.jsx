"use client";
function ProfilePage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Text: ", text);
  };
  return (
    // This is the Profile page. Currently being used as scratchpad
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
      <div className="max-w-3xl max-h-screen bg-slate-400">Profile Page</div>
      <div className="max-w-4xl max-h-screen bg-slate-300">Add comments1</div>

      <button className="btn btn-primary" type="submit">
        Just a button
      </button>

      {/* <div className="max-w-2xl max-h-screen bg-slate-200">Add comments2</div> */}
      <div className="join w-full">
        <input
          type="text"
          placeholder="Message GeniusGPT"
          className="input input-bordered join-item w-full"
          required
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary join-item" type="submit">
          ask question
        </button>
      </div>
      {/* <div className="max-w-2xl max-h-screen bg-slate-200">Add comments2</div> */}
    </div>
  );
}

export default ProfilePage;
