/** @odoo-module */

import { Callbacks, HootError, createReporting } from "../hoot_utils";
import { Job } from "./job";

/**
 * @typedef {import("./tag").Tag} Tag
 *
 * @typedef {import("./test").Test} Test
 */

/**
 * @param {Pick<Suite, "name" | "parent">} suite
 * @param {...string} message
 * @returns {HootError}
 */
export function suiteError({ name, parent }, ...message) {
    const parentString = parent ? ` (in parent suite "${parent.name}")` : "";
    return new HootError(
        `error while registering suite "${name}"${parentString}: ${message.join("\n")}`
    );
}

export class Suite extends Job {
    callbacks = new Callbacks();
    currentJobIndex = 0;
    /** @type {(Suite | Test)[]} */
    currentJobs = [];
    /** @type {(Suite | Test)[]} */
    jobs = [];
    reporting = createReporting();
    weight = 0;

    increaseWeight() {
        this.weight++;
        if (this.parent) {
            this.parent.increaseWeight();
        }
    }

    resetIndex() {
        this.currentJobIndex = 0;

        for (const job of this.jobs) {
            job.runCount = 0;

            if (job instanceof Suite) {
                job.resetIndex();
            }
        }
    }

    /**
     * @override
     * @type {Job["willRunAgain"]}
     */
    willRunAgain(child) {
        let count = this.runCount;
        if (this.currentJobs.at(-1) === child) {
            count++;
        }
        if (count < (this.config.multi || 1)) {
            return true;
        }
        return Boolean(this.parent?.willRunAgain(this));
    }
}
