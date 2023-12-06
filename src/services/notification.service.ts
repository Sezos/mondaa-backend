import { UserService } from 'src/user/user.service';
import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { GroupUserService } from 'src/group-user/group-user.service';

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(
      'src',
      'services',
      'enormative-4782f-firebase-adminsdk-wnvm6-a84288079e.json',
    ),
  ),
});

@Injectable()
export class NotificationService {
  constructor(
    private userService: UserService,
    private groupUserService: GroupUserService,
  ) {}
  async send(title: string, body: string, userIds: number[]) {
    try {
      let users = await this.userService.findMany({ id: { in: userIds } });
      users = users.filter((user) => user.fcmToken !== null);
      users.map(async (user: any) => {
        await firebase
          .messaging()
          .send({
            notification: { title, body },
            apns: {
              payload: {
                aps: {
                  alert: {
                    title,
                    body,
                  },
                  sound: 'default',
                },
              },
            },
            token: user.fcmToken,
          })
          .catch((error: any) => {
            console.error(error);
          });
      });
      return users;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async sendGroupUsers(senderId: number, body: string, groupId: number) {
    try {
      const groupUsers = await this.groupUserService.findAll(groupId);
      const title = (await this.userService.findOneById(senderId)).firstName;

      const users = groupUsers.filter(
        (groupUser) => groupUser.fcmToken !== null,
      );

      users.map(async (user: any) => {
        await firebase
          .messaging()
          .send({
            notification: { title, body },
            apns: {
              payload: {
                aps: {
                  alert: {
                    title,
                    body,
                  },
                  sound: 'default',
                },
              },
            },
            token: user.fcmToken,
          })
          .catch((error: any) => {
            console.error(error);
          });
      });

      return users;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async sendNotiOff(date: string) {
    try {
      const users = await this.userService.employeesOff(date);
      console.log(users);
      this.send(
        'You are OFF Tomorrow',
        'Unfortunately, you were not assigned to any job tomorrow.',
        users.map((user) => user.id),
      );
    } catch (err) {
      return err;
    }
  }
}
