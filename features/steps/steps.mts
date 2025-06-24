import { Given, Then, When } from '@cucumber/node'
import { publishReport } from '../actions/publishReport.mjs'
import { Actor } from '../support/Actor.mjs'
import { retrieveReport } from '../actions/retrieveReport.mjs'
import assert from 'node:assert'
import crypto from 'node:crypto'
import { canSeeResults } from '../actions/canSeeResults.mjs'
import { PublishResult } from '../actions/types'
import { isScheduledForDeletion } from '../actions/isScheduledForDeletion.mjs'
import { deleteReport } from '../actions/deleteReport.mjs'
import { wasDeleted } from '../actions/wasDeleted.mjs'
import { wasNotFound } from '../actions/wasNotFound.mjs'
import { navigateToSite } from '../actions/navigateToSite.mjs'
import { canSeeSample } from '../actions/canSeeSample.mjs'

Given('a Cucumber implementation that omits some fields', async (t) => {
  t.world.messagesFixture = 'messages-omissions.ndjson'
})

Given('{actor} has a private token', async (t, actor: Actor) => {
  actor.remember('privateToken', crypto.randomBytes(16).toString('hex'));
})

Given('a report previously published by {actor} has been deleted', async (t, actor: Actor) => {
  actor.remember('publishResult', {
    success: true,
    banner: 'Report published',
    url: `http://localhost:3000/reports/${crypto.randomUUID()}`,
  })
})

When('{actor} publishes a report', async (t, actor: Actor) => {
  const publishResult = await actor.attemptsTo(publishReport(t.world.messagesFixture, actor.recall('privateToken')))
  actor.remember('publishResult', publishResult)
  t.world.publishResults.push(publishResult)
})

When('{actor} shares their link with {actor}', async (t, publisher: Actor, receipient: Actor) => {
  const publishResult = publisher.recall<PublishResult>('publishResult')
  receipient.remember('sharedUrl', publishResult.url)
})

When('{actor} views the report they just published', async (t, actor: Actor) => {
  const page = await actor.attemptsTo(retrieveReport(actor.recall('publishResult')))
  actor.remember('page', page)
})

When('{actor} views the shared report', async (t, actor: Actor) => {
  const page = await actor.attemptsTo(retrieveReport(actor.recall('sharedUrl')))
  actor.remember('page', page)
})

When('{actor} attempts to view their report', async (t, actor: Actor) => {
  const page = await actor.attemptsTo(retrieveReport(actor.recall('publishResult')))
  actor.remember('page', page)
})

When('{actor} deletes the report', async (t, actor: Actor) => {
  await actor.attemptsTo(deleteReport(actor.recall('page')))
})

When('{actor} accesses the site directly', async (t, actor: Actor) => {
  const page = await actor.attemptsTo(navigateToSite())
  actor.remember('page', page)
})

Then('{actor} should see a sample report', async (t, actor: Actor) => {
  assert.ok(await actor.ask(canSeeSample(actor.recall('page'))))
})

Then('{actor} should see the(ir) test results', async (t, actor: Actor) => {
  assert.ok(await actor.ask(canSeeResults(actor.recall('page'))))
})

Then('{actor} should see that the report is scheduled for deletion', async (t, actor: Actor) => {
  assert.ok(await actor.ask(isScheduledForDeletion(actor.recall('page'))))
})

Then('{actor} should see the message:', async (t, actor: Actor, expectedBanner: string) => {
  assert.strictEqual(actor.recall<PublishResult>('publishResult').banner.trim(), expectedBanner.trim())
})

Then('no report should be published', async (t) => {
  assert.ok(t.world.publishResults.every((publishResult: PublishResult) => !publishResult.success))
})

Then('{actor} should see that the report was deleted', async (t, actor: Actor) => {
  assert.ok(await actor.ask(wasDeleted(actor.recall('page'))))
})

Then('{actor} should see that no report was found', async (t, actor: Actor) => {
  assert.ok(await actor.ask(wasNotFound(actor.recall('page'))))
})