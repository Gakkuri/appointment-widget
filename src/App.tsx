import { useState } from "react";
import { Calendar } from "./components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import Step from "./components/ui/step";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentPage, setCurrentPage] = useState(1);

  const steps = ["Test 1", "Test 2", "Test 3"];

  const onChangePage = (addition: number) => {
    setCurrentPage((current) => current + addition);
  };

  return (
    <Dialog>
      <DialogTrigger className="absolute bottom-10 right-10 bg-slate-600 py-2 px-4 text-white rounded-full">
        Appointment
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request an appointment</DialogTitle>
          <DialogDescription className="pt-4">
            <div className="flex">
              {/* Left Pane */}
              <div
                id="steps"
                className="flex flex-col grow-0 shrink-0 basis-1/4"
              >
                {steps.map((step, i) => (
                  <Step step={++i} label={step} isFinished={i < currentPage} />
                ))}
              </div>
              {/* Right Pane */}
              <div id="content" className="flex flex-col grow-0 basis-3/4">
                <div className="flex">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>

                <div>
                  {currentPage > 1 && (
                    <Button
                      className="mx-1 my-2"
                      onClick={() => onChangePage(-1)}
                    >
                      Prev
                    </Button>
                  )}
                  <Button onClick={() => onChangePage(1)}>Next</Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default App;
