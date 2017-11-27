import { Injectable } from '@angular/core';
import { Planning } from '../models/Planing';

@Injectable()
export class PlanningService {

    public setPlannings(plannings: Array<Planning>){
        sessionStorage.setItem('plannings', JSON.stringify(plannings));
    }

    public setPlanning(planning: Planning){
        var plannings = this.getPlannings();
        var _planning : Planning;
        for(var i = 0; i < plannings.length; i++){
            _planning = plannings[0];
            if(_planning._id == planning._id){
                plannings[0] = planning;
            }
        }
        this.setPlannings(plannings);
    }

    public getPlannings() : Array<Planning> {
        var plannings = JSON.parse(sessionStorage.getItem('plannings'));
        return plannings;
    }

    public getPlanning(id: string) : Planning {
        var plannings = this.getPlannings();
        var planning;
        for(var i = 0; i < plannings.length; i++){
            planning = plannings[i];
            if(planning._id == id){
                return planning;
            }
        }
    }
}