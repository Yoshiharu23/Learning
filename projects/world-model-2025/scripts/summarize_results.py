"""Summarize archived Slot Attention CSVs without ML dependencies."""

import argparse
import csv
import json
import math
from pathlib import Path
from statistics import mean


PROJECT = Path(__file__).resolve().parents[1]


def finite_number(value):
    if value is None or not str(value).strip():
        return None
    result = float(value)
    return result if math.isfinite(result) else None


def summarize(project=PROJECT):
    results = project / "results" / "slot-attention"
    with (results / "video_eval_summary.csv").open(newline="", encoding="utf-8") as handle:
        videos = list(csv.DictReader(handle))
    with (results / "metrics.csv").open(newline="", encoding="utf-8") as handle:
        training = list(csv.DictReader(handle))
    if not videos or not training:
        raise ValueError("Both archived CSVs must contain data.")
    swaps = sum(int(row["swaps"]) for row in videos)
    transitions = sum(int(row["transitions"]) for row in videos)
    if transitions <= 0:
        raise ValueError("The total number of transitions must be positive.")
    rates = [finite_number(row["swap_rate"]) for row in videos]
    consistency = [finite_number(row["consistency_iou"]) for row in videos]
    if any(value is None or not 0 <= value <= 1 for value in rates + consistency):
        raise ValueError("Video metrics must be finite numbers between 0 and 1.")
    for row, rate in zip(videos, rates):
        count = int(row["transitions"])
        if count <= 0 or not math.isclose(rate, int(row["swaps"]) / count, abs_tol=1e-12):
            raise ValueError("A video swap rate does not match its counts.")
    final = max(training, key=lambda row: int(row["step"]))
    validation_count = sum(finite_number(row["val_loss"]) is not None for row in training)
    return {
        "evaluation_source": "results/slot-attention/video_eval_summary.csv",
        "training_source": "results/slot-attention/metrics.csv",
        "evaluation": {
            "video_count": len(videos),
            "mean_video_swap_rate": mean(rates),
            "total_swaps": swaps,
            "total_transitions": transitions,
            "pooled_swap_rate": swaps / transitions,
            "mean_video_consistency_iou": mean(consistency),
        },
        "training": {
            "logged_rows": len(training),
            "final_step": int(final["step"]),
            "final_loss": finite_number(final["loss"]),
            "final_recorded_ari": finite_number(final["ari"]),
            "finite_validation_loss_rows": validation_count,
        },
        "scope": "Recomputed from archived CSVs; no model training or inference performed.",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check against the saved summary.json.")
    args = parser.parse_args()
    result = summarize()
    if args.check:
        expected = json.loads((PROJECT / "results" / "summary.json").read_text(encoding="utf-8"))
        if result != expected:
            raise SystemExit("Summary differs from results/summary.json.")
        print("Archived CSV summary matches results/summary.json.")
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
