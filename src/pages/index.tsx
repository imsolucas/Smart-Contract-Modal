import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useWriteContract } from "wagmi";
import abi from "../abi.json";
import { useEffect, useState } from "react";
import { Abi } from "viem";

export default function Home() {
  const [results, setResult] = useState<any>(null);
  const [peopleIndex, setPeopleIndex] = useState(0);
  const [personName, setPersonName] = useState("");
  const [favoriteNumber, setFavoriteNumber] = useState("");
  const { writeContract } = useWriteContract();
  const [currentPerson, setCurrentPerson] = useState<any>(null);

  // Read the single value
  const result = useReadContract({
    abi: abi as Abi,
    address: "0xdd121B564e5c0D1D43Ae3a8BF60e516217aC1561",
    functionName: "retrieve",
  });

  // Read the current person
  const listOfPeople = useReadContract({
    abi: abi as Abi,
    address: "0xdd121B564e5c0D1D43Ae3a8BF60e516217aC1561",
    functionName: "listOfPeople",
    args: [peopleIndex],
  });

  useEffect(() => {
    if (result.data) {
      setResult(result.data);
    }
  }, [result.data]);

  useEffect(() => {
    if (listOfPeople.data) {
      setCurrentPerson({
        favoriteNumber: Number((listOfPeople.data as any[])[0]),
        name: (listOfPeople.data as any[])[1],
      });
    }
  }, [listOfPeople.data]);

  const addPerson = () => {
    if (personName && favoriteNumber) {
      writeContract({
        abi,
        address: "0xdd121B564e5c0D1D43Ae3a8BF60e516217aC1561",
        functionName: "addPerson",
        args: [personName, parseInt(favoriteNumber)],
      });
      // Clear input fields after adding
      setPersonName("");
      setFavoriteNumber("");
    }
  };

  const nextPerson = () => {
    setPeopleIndex((prev) => prev + 1);
  };

  const previousPerson = () => {
    if (peopleIndex > 0) {
      setPeopleIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Store Value</h1>
      {result.data ? (
        <h1>{results ? Number(results) : "No data"}</h1>
      ) : (
        <h1>Loading</h1>
      )}

      <button
        onClick={() =>
          writeContract({
            abi,
            address: "0xdd121B564e5c0D1D43Ae3a8BF60e516217aC1561",
            functionName: "store",
            args: ["25"],
          })
        }
      >
        Store
      </button>

      <div>
        <h1>Current Person</h1>
        {currentPerson ? (
          <div>
            <p>Name: {currentPerson.name}</p>
            <p>Favorite Number: {currentPerson.favoriteNumber}</p>
          </div>
        ) : (
          <p>No person data available</p>
        )}
        <div className="p-4 gap-x-4">
          <button
            onClick={previousPerson}
            disabled={peopleIndex === 0}
            className="border-4 border-rose-500 border-double rounded-lg"
          >
            Previous
          </button>
          <button
            onClick={nextPerson}
            className="border-4 border-rose-500 border-double rounded-lg"
          >
            Next
          </button>
        </div>
        <p>Index: {peopleIndex}</p>

        <input
          type="text"
          placeholder="Person Name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Favorite Number"
          value={favoriteNumber}
          onChange={(e) => setFavoriteNumber(e.target.value)}
        />

        <button onClick={addPerson}>Add Person</button>
      </div>
      <ConnectButton />
    </div>
  );
}
