import { Given, When } from '@cucumber/cucumber'
import { World } from '../environment'
import { config } from '../../config'
import { DateTime } from 'luxon'
import { kebabCase } from 'lodash'
import { Runtime } from '../../support/objects/runtime'

async function LogInUser(this: World, stepUser: string): Promise<void> {
  const user = this.usersEnvironment.getUser({ id: stepUser })
  const { page } = await this.actorsEnvironment.createActor({
    id: stepUser,
    namespace: kebabCase(
      [this.feature.name, stepUser, DateTime.now().toFormat('yyyy-M-d-hh-mm-ss')].join('-')
    )
  })
  // const loginPage = new LoginPage({ actor })
  const po = new Runtime({ page })

  await page.goto(config.frontendUrl)
  // await loginPage.login({ user })
  await po.session.login({ user })
}

Given('{string} has logged in', LogInUser)

When('{string} logs in', LogInUser)

async function LogOutUser(this: World, stepUser: string): Promise<void> {
  const actor = await this.actorsEnvironment.getActor({ id: stepUser })
  // const runtimePage = new RuntimePage({ actor })
  const po = new Runtime({ page: actor.page })
  await po.session.logout()
  await actor.close()
}

Given('{string} has logged out', LogOutUser)

When('{string} logs out', LogOutUser)
