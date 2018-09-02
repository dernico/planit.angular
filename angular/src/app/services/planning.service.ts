import { Injectable } from '@angular/core';
import { Planning } from '../models/Planing';
import { HttpClient } from '@angular/common/http';
import { Configs } from '../configs';
import { File } from '../models/File';
import { Step } from '../models/Step';
import { Distance } from '../models/Distance';

@Injectable()
export class PlanningService {

    constructor(private http: HttpClient) { }

    public setPlannings(plannings: Array<Planning>) {
        sessionStorage.setItem('plannings', JSON.stringify(plannings));
    }

    public setPlanning(planning: Planning) {
        var plannings = this.getPlannings();
        var _planning: Planning;
        for (var i = 0; i < plannings.length; i++) {
            _planning = plannings[i];
            if (_planning._id == planning._id) {
                plannings[0] = planning;
            }
        }
        this.setPlannings(plannings);
        this.updatePlanning(planning)
    }

    public getPlannings(): Array<Planning> {
        var plannings = JSON.parse(sessionStorage.getItem('plannings'));
        return plannings;
    }

    public getPlanning(id: string): Planning {
        var plannings = this.getPlannings();
        var planning;
        for (var i = 0; i < plannings.length; i++) {
            planning = plannings[i];
            if (planning._id == id) {
                if (planning.steps == undefined) {
                    planning.steps = [];
                }
                if (planning.costs == undefined) {
                    planning.costs = [];
                }
                return planning;
            }
        }
    }

    public stepTotalCosts(step: Step) {
        let totalCosts = 0;
        if (step && step.todos && step.todos.length > 0) {
            step.todos.forEach(todo => {
                totalCosts += todo.costs;
            });
        }
        return totalCosts;
    }

    public removeEdit(step) {
        //we need to remove the temp field edit that is needed to show input fields
        if ("edit" in step) {
            delete step["edit"];
        }
    }

    public addStep(plan: Planning, step: Step) {


        if (!step._id) {
            // this is when step is a new step!
            plan.steps.push(step);
        }

        //this.recaluclateDistances(plan, step);
    }

    public addFilesToPlan(plan: Planning, newFiles: File[]) {
        if (!plan.files) {
            plan.files = [];
        }
        plan.files = plan.files.concat(newFiles);
        this.setPlanning(plan);
    }

    public deleteFileFromPlan(plan: Planning, index: number) {
        plan.files.splice(index, 1);
        this.setPlanning(plan);
    }

    private updatePlanning(plan: Planning) {
        this.http.post(Configs.planningsUrl, plan).subscribe((resp) => { });
    }

    private recaluclateDistances(plan: Planning, step: Step) {
        // Recalculate the distances for between each step      
        if (plan.steps.length > 0) {

            let prevStep;
            if (!step._id) {
                // this is when step is a new step!
                prevStep = plan.steps[plan.steps.length - 2];
            }
            else {
                // this is when step already exists
                for (let i = 0; i < plan.steps.length; i++) {
                    if (plan.steps[i]._id == step._id) {
                        if (i > 0) {
                            prevStep = plan.steps[i - 1];
                            break;
                        }
                    }
                }
            }
            if (prevStep) {

                var url = Configs.placesDistanceUrl + "?startLat=" + prevStep.location.lat + "&startLng=" + prevStep.location.lng;
                url += "&endLat=" + step.location.lat + "&endLng=" + step.location.lng;
                this.http.get(url).subscribe((rows: Array<any>) => {
                    if (rows.length > 0 && rows[0].elements.length > 0) {
                        var result = rows[0].elements[0];
                        var distance = new Distance();
                        distance.distance = {
                            text: result.distance.text,
                            value: result.distance.value
                        };
                        distance.duration = {
                            text: result.duration.text,
                            value: result.duration.value
                        };
                        prevStep.distance = distance;
                    }

                    this.setPlanning(plan);
                });
            }
            else {
                this.setPlanning(plan);
            }
        }
        else {
            this.setPlanning(plan);
        }
    }
}